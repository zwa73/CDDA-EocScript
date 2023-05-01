export interface JModule{
    genJson:()=>JObject|number|string|boolean|Array<JObject|string|number|boolean>;
}


export type JToken = JObject|JArray|JValue;
export type JValue = number|string|boolean|null;
export type JArray = Array<JToken>;
//export type JProperty = {"key":string,"value":JToken}
//export type JObject = Array<JProperty>;
//export type JProperty = { key: string, value: JToken };
export type JObject = {
    [key:string]:JToken;
}


