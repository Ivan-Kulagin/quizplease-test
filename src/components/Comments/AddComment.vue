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
  <div class="add-button">
    <Textarea @input="onChangeInput" :value="modelValue" placeholder="Напишите комментарий" />
    <Button v-if="modelValue.length" size="small" @click="onCancel">Отменить</Button>
    <Button v-if="modelValue.length" size="small" @click="onSave">Сохранить</Button>
  </div>
</template>

<style scoped>
.add-button {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    margin-bottom: 12px;
}
</style>
