import {createCachedAsyncFunction} from "@/common/utils";
import AV from "leancloud-storage";

export const getHeroes = createCachedAsyncFunction(async ()=>{
    const heroQuery = new AV.Query('Hero');
    return heroQuery.limit(1000).find().then(res => {
        return res.map(i => i.toJSON());
    });
},60000)
