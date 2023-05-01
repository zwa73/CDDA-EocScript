import * as utils from "Utils";
export type RecurrenceValue = number | RecurrenceObject | [number, number];
export interface RecurrenceObject {
    [key: string]: any;
    name: string;
    type: string;
    context: string;
    default?: number | string;
    global?: boolean;
}
/**
 * Recurrence类用于生成符合要求的JSON对象
 */
export declare class Recurrence implements utils.JModule {
    private recurrence;
    /**
     * 创建一个Recurrence对象
     * @param {number} interval - recurrence字段的初始值（以秒为单位）
     */
    constructor(interval: number);
    /**
     * 将recurrence字段的值设置为一个对象
     * @param {string} name - 对象的name字段
     * @param {string} type - 对象的type字段
     * @param {string} context - 对象的context字段
     * @param {number|string} [def] - 对象的default字段（可选）
     * @param {boolean} [global] - 对象的global字段（可选）
     */
    setObject(name: string, type: string, context: string, def?: number | string, global?: boolean): void;
    /**
     * 将recurrence字段的值设置为一个数组
     * @param {number} value1 - 数组的第一个值
     * @param {number} value2 - 数组的第二个值
     */
    setArray(value1: number, value2: number): void;
    /**
     * 将recurrence字段的值设置为一个整数
     * @param {number} interval - recurrence字段的新值（以秒为单位）
     */
    setNumber(interval: number): void;
    /**
     * 生成一个符合要求的JSON对象
     * @returns {object} 一个包含recurrence字段的JSON对象
     */
    genJson(): RecurrenceValue;
}
export default Recurrence;
