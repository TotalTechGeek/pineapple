{
  String.prototype.stripEscape = function(seq) { return this.replace(`\\${seq}`, seq); }
  
 
 function toJsonSchema (schema) {
    if (Array.isArray(schema)) {
        return {
            type: 'array',
            items: toJsonSchema(schema[0])
        }
    }

    if (schema === 'string') {
        return {
            type: 'string'
        }
    }

    if (schema === 'number') {
        return {
            type: 'number'
        }
    }

    if (schema === 'boolean') {
        return {
            type: 'boolean'
        }
    }

    if (typeof schema === 'object') {
        const result = {
            type: 'object',
            properties: {},
            required: []
        }

        for (let key in schema) {
            result.properties[key] = toJsonSchema(schema[key])
            result.required.push(key)
        }

        return result
    }
    
    throw new Error('Unrecognized Schema')
}

  function traverse (item, check) {
      if (typeof item === 'object' && item) {
          if (Array.isArray(item)) {
              return check(item) || item.some(i => traverse(i, check));
          }
          return check(item) || Object.keys(item).some(key => traverse(item[key], check));
      }
      return check(item)
  }
   
  function joinStrings(acc, current) {
    if (!acc[acc.length - 1]) return [current];
    if (typeof current === 'object') return [...acc, current];
    if (typeof acc[acc.length - 1] === 'string') acc[acc.length - 1] += current;
    else acc.push(current);
    return acc;
  }
   
  function recurseObject (obj) { 
    if (Array.isArray(obj)) {
        const res = obj.map(recurseObject).flat().filter(i=>i);
        return res
    }
    if (obj && typeof obj === 'object') {
        const key = Object.keys(obj)[0];


        if (key === 'var') return [obj]
        if (key === 'context') return [obj]

        return [recurseObject(obj[key])].flat() 
    }

    return null
 }
  
  function reduceArithmetic(head, tail) {
    return [head, ...tail].reduce((acc, val) => {
      if (acc == null) {
        return val;
      }

      const substitutions = {
        '||': 'or',
        '&&': 'and'
      }
      

      const operator = substitutions[val[1]] || val[1];
      const rightHandSide = val[3];

      return { [operator]: [acc, rightHandSide] }
    }, null)
  }
}

// Documents
Document = TestExpressionLayered

TypesParsed = val:Types { return { preserve: toJsonSchema(val) } }

TypeObject "object"
  = _ "{" _ body:(TypeObjectEntry*) _ "}" {
    const arr = body.flat()
    const res = {}
    for (let i = 0; i < arr.length; i += 2) res[arr[i]] = arr[i+1]
    return res
  }

TypeObjectEntry "object-entry"
  = pair:TypeEntryPair _ "," _ tail:(TypeObjectEntry) { return [ ...pair, ...tail ] }
  / pair:TypeEntryPair _ ","?                     { return pair }

 
TypeEntryPair
  = _ key:(Identifier/String) _ ":" _ val:Types { return [key, val]; }
  
Types = val:("string" / "number" / "boolean" / TypeObject) "[]" { return [val] }
      / ("string" / "number" / "boolean" / TypeObject)


TestExpressionLayered = a:TestExpression "~>" b:TestExpressionLayered { 
 if(a.snapshot) a = { execute: a.snapshot }
  return [a, ...b] 
 }
  / val:TestExpression { return [val] }

TestExpression = 
     ops:Operands _req ("resolves to" / "resolves") _req result:Expression _ { 
      if (traverse(result, i => i && typeof i.var !== 'undefined')) {
        return {
          resolvesParse: [ops, result]
        }
      }
      return { resolves: [ops, result] } 
  }
  /  ops:Operands _req ("to" / "is" / "returns") _req result:Expression _ { 
      if (traverse(result, i => i && typeof i.var !== 'undefined')) {
        return {
          toParse: [ops, result]
        }
      }
      return { to: [ops, result] } 
  }
  /  ops:Operands _req ("resolves") _ { 
      return { resolvesParse: [ops, true] } 
  }
  /  ops:Operands _req ("returns") _ { 
      return { toParse: [ops, true] } 
  }
  /  ops:Operands _req type:("throws"/ "rejects") _req name:([A-Za-z]+) _ { return { [type]: [ops, name.join('')] } }
  /  ops:Operands _req type:("throws"/ "rejects") _req name:(String) _ { return { [type]: [ops, name] } }
  /  ops:Operands _req type:("throws" / "rejects") _ { return { [type]: [ops] } }
  /  ops:Operands _req "snapshot" _req expression:Expression _ { return { snapshot: [ops, expression] } }
  /  ops:Operands " snapshot"? _ { return { snapshot: [ops] } }

Operation
  = op:Operator _req exps:Operands                    { return { operator: op, expressions: exps } }
  / op:Operator                                       { return { operator: op, expressions: []   } }

Operator
  = '#' id:OperatorIdentifier { return `#${id}` }
  / "!" id:OperatorIdentifier { return `!${id}` }
  /     id:OperatorIdentifier { return id }

Operands
  = 
    _ "$." call:FunctionCall { const key = Object.keys(call)[0]; const result = [key, ...[].concat(call[key])]; result.special = true; return [result] }
  / _ exp:Expression _ "," _ tail:Operands { return [exp, ...tail] }
  / _ exp:Expression { return [ exp ]; }
  
OperationDelimiter
  = [ \t\r]* [;\n]+ [ \t\r]*
  / ' '
  
Split
  = _ '>>' doc:Document '<<' {
      return [
        { split: doc }
        // ,{ operator: 'mergeAll' }
      ]
    }

Fork
  = _ 'fork' _req type:Identifier _ '>>' _ body:ForkBody _ '<<' {
      return { fork: body, type: type }
  } 
  / _ 'fork' _req _ '>>' _ body:ForkBody _ '<<' {
      return { fork: body, type: "merge" }
  }

ForkBody
  = _ '(' _ head:Document _ ')' tail:ForkBody* { return [head, ...(tail.flat() || [])] }

// Expressions
Expression "expression"
  = ArithmeticExpression
  / FunctionCall
  / NonArithmeticExpression
  
  
Shorthand = "function" { return "function" }

EnglishChecks = 
      "truthy" { return {var: 'data'} }
    / ("falsy"/"falsey")  { return {not:{var: 'data'}} }
    / "defined" { return { "!==": [{var:'data'}, undefined] } }
    

NonArithmeticExpression
  = Object
  / Array
  / EnglishChecks
  / Boolean
  / Numeric
  / VarIdentifier
  / ContextIdentifier
  / String
  / FunctionCall
  / Infinity
  / Null
  / Undefined

ArithmeticExpression = ArithmeticExpression9
ArithmeticExpression9
  = head:ArithmeticExpression8 tail:(_ ('||' / 'or') _ val:ArithmeticExpression8)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression8
ArithmeticExpression8
  = head:ArithmeticExpression7 tail:(_ ('&&' / 'and') _ val:ArithmeticExpression7)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression7
ArithmeticExpression7
  = head:ArithmeticExpression6 tail:(_ ('!==' / '!=' / '===' / '==') _ val:ArithmeticExpression6)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression6
ArithmeticExpression6
  = head:ArithmeticExpression5 tail:(_ ('<=' / '<' / '>=' / '>' / 'in') _ val:ArithmeticExpression5)+
    { return reduceArithmetic(head, tail); }
  / head:ArithmeticExpression5 tail:(_ ('as') _ val:(TypesParsed / Shorthand / ArithmeticExpression5))+
    { return reduceArithmetic(head, tail); } 
  / ArithmeticExpression5
ArithmeticExpression5
  = head:ArithmeticExpression4 tail:(_ ('+' / '-') _ val:ArithmeticExpression4)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression4
ArithmeticExpression4
  = head:ArithmeticExpression3 tail:(_ '%' _ val:ArithmeticExpression3)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression3
ArithmeticExpression3
  = head:ArithmeticExpression2 tail:(_ ('*' / '/') _ val:ArithmeticExpression2)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression2
ArithmeticExpression2
  = head:ArithmeticExpression1 tail:(_ '**' _ val:ArithmeticExpression1)+
    { return reduceArithmetic(head, tail); }
  / ArithmeticExpression1
ArithmeticExpression1
  = op:('!' / '+' / '-') head:ArithmeticExpression0
    { return { [op]: head } }
  / ArithmeticExpression0
ArithmeticExpression0
  = _ "(" _ exp:Expression _ ")" { return exp; }
  / NonArithmeticExpression

FunctionCall
  = _ id:Identifier _ '(' _ args:FunctionArgs _ ').' getId:Identifier {
    return { get: [{ [id]: args.length <= 1 ? args[0] : args }, getId] }
  } 
  / _ id:Identifier _ '(' _ args:FunctionArgs _ ')' {
    return { [id]: args.length <= 1 ? args[0] : args }
  }
FunctionArgs
  = head:Expression _ "," _ tail:(FunctionArgs) { return [head, ...tail]; }
  / head:Expression _ ","?                      { return [head]; }
  / _                                           { return []; }


// Literals
Object "object"
  = _ "{" _ body:(ObjectEntry*) _ "}" {
    const arr = body.flat()
    if (!arr.some(i=> i && i.merge)) return { obj: arr }
    
    let objs = []
	  let current = { obj: [] }

    for(const i of arr) {
        if (i && i.merge) {        
            if (current.obj.length) objs.push(current)
            objs.push(i.merge)
            current = { obj: [] }
        }
        else current.obj.push(i)
    }

    if (current.obj.length) objs.push(current)
   
    return { combine: objs }
  }

ObjectEntry "object-entry"
  = pair:ObjectEntryPair _ "," _ tail:(ObjectEntry) { return [ ...pair, ...tail ] }
  / pair:ObjectEntryPair _ ","?                     { return pair }
  / _ "..." expr:Expression _ ","?                  { return [{ merge: expr }] }
 
ObjectEntryPair
  = _ key:ObjectKey _ ":" _ val:Expression { return [key, val]; }
  / _ val:Expression  { 
      const result = recurseObject(val)
      if (!result) error('Expression in object does not contain a single reference to a variable.')
      if (result.length !== 1) error('Expression in object does not contain a single reference to a variable. (' + result.map(i=>i.var || i.context).join(' & ') + ' referenced)')
      return [(result[0].var || result[0].context).split('.').pop(), val]
  }
  
ObjectKey
  = Expression
  / Identifier

Array "array"
  = _ "[" _ body:(ArrayEntry*) _ "]" { return { list: body.flat() } }
  
ArrayEntry
  = value:Expression _ "," _ tail:(ArrayEntry) { return [value, ...tail] }
  / value:Expression _ ","?					   { return [value]          }
 
Identifier "identifier"
  = [a-zA-Z_0-9] [.a-zA-Z0-9_-]* { return text() }
  / '@' id:Identifier { return text() }
  / '$' id:Identifier { return text() }
VarIdentifier "@-identifier"
  = "@." id:MemberIdentifier { return { var: `data.${id}` } }
  / "@" { return { var: 'data' } }
ContextIdentifier "$-identifier"
  = '$.' id:MemberIdentifier { return { var: `context.${id}` } }
  / "$" { return { var: 'context' } }
MemberIdentifier "member-identifier"
  = Identifier
  / Integer { return text() }
OperatorIdentifier "operator-identifier" 
  = [a-zA-Z_] [.a-zA-Z0-9_-]* { return text() }


String "string"
  = '"' value:(DoubleQuotedStringContents*) '"'   { return value.join(''); }
  / "'" value:(SingleQuotedStringContents*) "'"   { return value.join(''); }  
  
  
DoubleQuotedStringContents
  = '\\"' { return text().stripEscape('"'); }
  / [^"]

SingleQuotedStringContents
  = "\\'" { return text().stripEscape("'") }
  / [^']

Boolean
  = 'true' { return true; }
  / 'false' { return false; }
  
Infinity = 'Infinity' { return Infinity }
Null = 'null' { return null }
Undefined = ('undefined' / 'void') { return undefined }

Numeric
  = _ [0-9]* "." [0-9]+ ([eE][-]?[0-9]+)? { return Number(text()) }
  / _ [0-9]+ "." [0-9]* ([eE][-]?[0-9]+)? { return Number(text()) }
  / BigInt
  / Integer
  
BigInt 
 = num:([0-9]+) "n" { return { bigint: text().replace("n", "") } }

Integer 'integer'
  = _ [0-9]+ ([eE][-]?[0-9]+)? { return Number(text()) }
  
// Whitespace & Comments 
Comment =   [ \t\n\r]* '//' ([^\n]*)       
          / [ \t\n\r]* '/*' (!'*/' .)* '*/' 

_req "required whitespace"
  = Comment* [ \t\n\r]+
  
_ "optional whitespace"
  = Comment* [ \t\n\r]*