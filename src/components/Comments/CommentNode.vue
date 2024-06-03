<script setup lang="ts">
import type { Comment, User } from '../../types'
import AddComment from '../Comments/AddComment.vue'
import { ref, computed } from 'vue'
const emit = defineEmits(['reply:cancel', 'reply:create', 'comment:edit', 'comment:delete', 'upvote', 'downvote'])
interface Props extends Comment {
    currentUser: User
}
const props = defineProps<Props>()

const onCancelReply = (event) => {
    emit('reply:cancel', event)
    replyVisible.value = false
}

const onCreateReply = (event) => {
    emit('reply:create', event)
    replyVisible.value = false
}

const onDeleteComment = (event) => {
    emit('comment:delete', { originalEvent: event, id: props.id })
}

const replyVisible = ref(false)
const replyText = ref('')
const toggleReply = () => {
    if (editVisible.value) toggleEdit()
    replyVisible.value = !replyVisible.value
}

const commentText = ref('')
const editVisible = ref(false)
const toggleEdit = () => {
    if (replyVisible.value) toggleReply()
    commentText.value = props.text
    editVisible.value = !editVisible.value
}

const onCancelEdit = (event) => {
    editVisible.value = false
}
const onEditComment = (event) => {
    emit('comment:edit', {...event, id: props.id })
    editVisible.value = false
}

const onUpvote = (event) => {
    emit('upvote', { originalEvent: event, id: props.id })
}

const onDownvote = (event) => {
    emit('downvote', { originalEvent: event, id: props.id })
}

const isCurrent = computed(() => {
    return props.author.profileId === props.currentUser.profileId
})

const likeActive = computed(() => {
    return props.likes.includes(props.currentUser.profileId)
})

const dislikeActive = computed(() => {
    return props.dislikes.includes(props.currentUser.profileId)
})

const voteDiff = computed(() => {
    return props.likes.length - props.dislikes.length
})

const counterStyle = computed(() => {
    if (voteDiff.value > 0) {
        return { color: 'darkseagreen' }
    } else if (voteDiff.value < 0) {
        return { color: 'indianred' }
    }
})
</script>

<template>
<div class="comment">
  <div class="comment__line-wrapper">
    <div class="comment__line" />
    <div class="comment__container">
      <div class="comment__meta">
        <Avatar :label="author.name[0]" style="background-color: #dee9fc; color: #1a2551" size="normal" shape="circle" />
        <a :href="`#/user/${author.profileId}`">{{ author.name }}</a>
        <span>{{ datetime }}</span>
      </div>
      <div class="comment__content">
        <div v-if="deleted" class="comment__text comment__text--deleted">Комментарий удалён</div>
        <div v-else class="comment__text">{{ deleted ? 'Комментарий удалён' : text }}</div>
        <div class="comment__actions">
          <Button text :icon="likeActive ? 'pi pi-thumbs-up-fill' : 'pi pi-thumbs-up'" :class="{'like--active': likeActive}" :disabled="deleted" @click="onUpvote" />
          <div class="comment__likes-counter" :style="counterStyle">{{ voteDiff }}</div>
          <Button text :icon="dislikeActive ? 'pi pi-thumbs-down-fill' : 'pi pi-thumbs-down'" :class="{'dislike--active': dislikeActive}" :disabled="deleted" @click="onDownvote" />
          <Button text v-if="!deleted" icon="pi pi-reply" size="small" label="Ответить" @click="toggleReply" />
          <Button text v-if="!deleted && isCurrent" icon="pi pi-pencil" size="small" @click="toggleEdit" />
          <Button text v-if="!deleted && isCurrent" icon="pi pi-trash" size="small" @click="onDeleteComment" />
        </div>
        <AddComment v-if="editVisible" v-model="commentText" @save="onEditComment" @cancel="onCancelEdit" :parent-id="null" />
        <AddComment v-if="replyVisible" v-model="replyText" @save="onCreateReply" @cancel="onCancelReply" :parent-id="id" />
      </div>
      <template v-for="reply in replies" :key="reply.id">
        <CommentNode
          :current-user="currentUser"
          :text="reply.text"
          :author="reply.author"
          :datetime="reply.datetime"
          :likes="reply.likes"
          :dislikes="reply.dislikes"
          :deleted="reply.deleted"
          :replies="reply.replies"
          :id="reply.id"
          @reply:create="emit('reply:create', $event)"
          @reply:cancel="emit('reply:cancel', $event)"
          @comment:delete="emit('comment:delete', $event)"
          @comment:edit="emit('comment:edit', $event)"
          @upvote="emit('upvote', $event)"
          @downvote="emit('downvote', $event)"
        />
      </template>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.comment {}
.comment__line-wrapper {
  display: flex;
  gap: 8px;
}
.comment__line {
  width: 6px;
  border-bottom: 2px solid #CCC;
  border-left: 2px solid #CCC;
  border-bottom-left-radius: 6px;
}
.comment__content {
  padding-left: 32px;
}
.comment__container {
  margin-bottom: 8px;
}
.comment__likes-counter {
  width: 20px;
  text-align: center;
}
.comment__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.comment__text {
  padding: 8px 0 8px 8px;
  white-space: pre-wrap;
}
.comment__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.comment__text--deleted {
  color: #AAA;
}
.like--active {
  color: darkseagreen !important;
  background-color: white;
}
.dislike--active {
  color: indianred !important;
  background-color: white;
}
.p-button {
  color: black;
  &:focus {
    box-shadow: none;
  }
}
::v-deep(.p-button-label) {
  font-weight: 400;
}
</style>
