/**
 * It asks the user if they want to accept the snapshot
 * @param {{ item: any, rule: string, id: string, file: string }} data
 * @returns A function that returns a boolean.
 */
export function askSnapshot({ item, rule, id, file }: {
    item: any;
    rule: string;
    id: string;
    file: string;
}): Promise<any>;
/**
 * It asks the user if they want to update the snapshot
 * @param {{ item: any, rule: string, id: string, value: any, file: string }} data
 * @returns A function that returns a boolean.
 */
export function askSnapshotUpdate({ item, value, rule, id, file }: {
    item: any;
    rule: string;
    id: string;
    value: any;
    file: string;
}): Promise<any>;
