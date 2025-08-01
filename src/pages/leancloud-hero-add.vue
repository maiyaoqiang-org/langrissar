<template>
    <div style="max-width:600px;margin:40px auto;">
        <h2>BP英雄管理工具</h2>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
            <el-form-item>
                <el-button type="success" @click="copyAndJump">去获取英雄</el-button>
            </el-form-item>

            <el-form-item prop="jsonStr">
                <el-input type="textarea" v-model="form.jsonStr" :rows="10" placeholder="请输入英雄 JSON 数据" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onAddClick">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AV from 'leancloud-storage'
import { ElMessage, ElMessageBox } from 'element-plus'
const form = ref({ jsonStr: '' })
const formRef = ref()

const rules = {
    jsonStr: [
        { required: true, message: '请输入 JSON 数据', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                try {
                    JSON.parse(value)
                    callback()
                } catch {
                    callback(new Error('JSON 格式错误'))
                }
            }, trigger: 'blur'
        }
    ]
}

const onAddClick = () => {
    formRef.value.validate(valid => {
        if (valid) {
            ElMessageBox.confirm('确定要添加该英雄数据吗？', '确认添加', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                addHero()
            })
        }
    })
}

const addHero = async () => {
    let data
    try {
        data = JSON.parse(form.value.jsonStr)
    } catch {
        ElMessage.error('JSON 格式错误！')
        return
    }
    try {
        const Hero = AV.Object.extend('Hero')
        const hero = new Hero()
        Object.entries(data).forEach(([k, v]) => hero.set(k, v))
        await hero.save()
        ElMessage.success('添加成功！')
        form.value.jsonStr = ''
    } catch (e) {
        ElMessage.error('添加失败: ' + (e.message || e))
    }
}

const code = `
// 1. 获取阵营信息（a 标签的 title）
const campElements = document.querySelectorAll('#mw-content-text > div > div.HeroInfo_Box > div.HeroInfo_Team > div > a');
const camp = Array.from(campElements).map(el => el.title).join(',');

// 2. 获取英雄名
const heroNameElement = document.querySelector('.HeroInfo_Name_CN');
const heroName = heroNameElement ? heroNameElement.innerHTML.trim() : '';

// 3. 构造头像链接
const logo = \`https://wiki.biligame.com/langrisser/special:redirect/file/头像 \${heroName}.png\`;

// 4. 获取职业（img 的 alt）
const occupationElements = document.querySelectorAll('#mw-content-text > div > table.wikitable.test > tbody > tr > td > img');
const occupation = Array.from(new Set(
  Array.from(occupationElements)
    .map(el => el.alt.replace(/^图标\s*职业\s*/, '').replace('.png', '').trim())
    .filter(Boolean)
)).join(',');

// 5. 获取来源信息（data-name 属性）
const provenanceElements = document.querySelectorAll('#mw-content-text > div > div.HeroInfo_Box > div.HeroInfo_From.bili-tips');
const provenance = Array.from(provenanceElements).map(el => el.getAttribute('data-name').replace(/文本=/,'')).filter(Boolean).join(',');

// 6. 获取稀有度（img 的 alt）
const rarityElement = document.querySelector('#mw-content-text > div > div.HeroInfo_Box > div.HeroInfo_Rank > img');
const rarity = (rarityElement ? rarityElement.alt : '').replace(/^级别\s*/, '').replace('.png', '').trim();

console.log(JSON.stringify({
  camp,
  heroName,
  logo,
  occupation,
  provenance,
  rarity
}, null, 2));
`
const copyAndJump = async () => {
    try {
        await navigator.clipboard.writeText(code)
        ElMessage.success('代码已复制到剪贴板')

        // 新tab打开
        window.open('https://wiki.biligame.com/langrisser/首页', '_blank');
    } catch (e) {
        ElMessage.error('复制失败')
    }
}
</script>