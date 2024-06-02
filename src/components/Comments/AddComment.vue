<script setup lang="ts">
import { ref } from 'vue'
interface Props {
    modelValue: string,
    parentId: number | null
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    parentId: null
})
const emit = defineEmits(['cancel', 'save', 'update:modelValue'])
const inputValue = ref('')

const clearInput = () => {
    emit('update:modelValue', '')
}

const onCancel = (event) => {
    emit('cancel', { originalEvent: event })
    clearInput()
}
const onSave = (event) => {
    emit('save', { originalEvent: event, text: props.modelValue, parentId: props.parentId })
    clearInput()
}
const onChangeInput = (event) => {
    emit('update:modelValue', event.target.value)
}
</script>

<template>
  <textarea @input="onChangeInput" :value="modelValue" />
  <button @click="onCancel">Отменить</button>
  <button @click="onSave">Сохранить</button>
</template>

<style scoped>

</style>
