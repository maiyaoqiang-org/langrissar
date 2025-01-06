import { ref, watch } from "vue";

export function useRefCache(key, defaultValue = null) {
    // 初始化缓存中的数据
    const cachedValue = localStorage.getItem(key);
    const data = ref(cachedValue !== null ? JSON.parse(cachedValue) : defaultValue);

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
