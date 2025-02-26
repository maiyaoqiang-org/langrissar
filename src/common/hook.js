import { ref, watch } from "vue";
import _ from 'lodash'

export function useRefCache(key, defaultValue = null) {
    // 初始化缓存中的数据
    const cachedValue = JSON.parse(localStorage.getItem(key));
    let currentData = defaultValue;
    if(cachedValue){
        if(_.isObject(cachedValue)){
            currentData = Object.assign(defaultValue,cachedValue)
        }else{
            currentData = cachedValue
        }
    }
    const data = ref(currentData);

    // 监听数据变化，更新到缓存
    watch(
        data,
        (newValue) => {
            if (newValue === null || newValue === undefined) {
                localStorage.removeItem(key); // 删除缓存
            } else {
                localStorage.setItem(key, JSON.stringify(newValue)); // 更新缓存
            }
        },
        { deep: true } // 深度监听，适用于对象或数组
    );

    return data;
}
