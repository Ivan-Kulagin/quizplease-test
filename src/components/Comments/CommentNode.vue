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
</script>

<template>
<div class="comment">
  <div class="comment__line-wrapper">
    <div class="comment__line">
      <div class="comment__line--base" />
      <div class="comment__line--border" />
    </div>
    <div class="comment__content">
      <div class="comment__meta">
        <a :href="`#/user/${author.profileId}`">{{ author.name }}</a>
        <span>{{ datetime }}</span>
      </div>
      <div v-if="deleted" class="comment__deleted">Комментарий удалён</div>
      <div v-else class="comment__text">{{ text }}</div>
      <div class="comment__actions">
        <button :class="{'like--active': likes.includes(currentUser.profileId)}" :disabled="deleted" @click="onUpvote">+</button>
        {{ likes.length - dislikes.length }}
        <button :class="{'dislike--active': dislikes.includes(currentUser.profileId)}" :disabled="deleted" @click="onDownvote">-</button>
        <button v-if="!deleted" @click="toggleReply">ответить</button>
        <button v-if="isCurrent && !deleted" @click="toggleEdit">редактировать</button>
        <button v-if="isCurrent && !deleted" @click="onDeleteComment">удалить</button>
      </div>
      <AddComment v-if="editVisible" v-model="commentText" @save="onEditComment" @cancel="onCancelEdit" :parent-id="null" />
      <AddComment v-if="replyVisible" v-model="replyText" @save="onCreateReply" @cancel="onCancelReply" :parent-id="id" />
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
  &--base {
    height: 100%;
    width: 2px;
    background-color: black;
  }
  &--border {
    width: 6px;
    height: 2px;
    background-color: black;
  }
}
.comment__content {

}
.comment__avatar {

}
.comment__meta {
  display: flex;
  gap: 8px;
}
.comment__text {
  white-space: pre-wrap;
}
.comment__actions {

}
.comment__deleted {
  color: #AAA;
}
.like--active {
  background-color: darkseagreen;
}
.dislike--active {
  background-color: indianred;
}
</style>
