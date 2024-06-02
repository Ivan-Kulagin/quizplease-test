<script setup lang="ts">
import CommentNode from './CommentNode.vue'
import type { Comment, User } from '../../types'
const emit = defineEmits(['reply:create', 'reply:cancel', 'comment:delete', 'comment:edit', 'upvote', 'downvote'])
interface Props {
    comments: Comment[],
    currentUser: User
}
defineProps<Props>()
</script>

<template>
  <template v-for="comment in comments" :key="comment.id">
    <CommentNode
      :current-user="currentUser"
      :replies="comment.replies"
      :likes="comment.likes"
      :dislikes="comment.dislikes"
      :deleted="comment.deleted"
      :text="comment.text"
      :datetime="comment.datetime"
      :author="comment.author"
      :id="comment.id"
      @reply:create="emit('reply:create', $event)"
      @reply:cancel="emit('reply:cancel', $event)"
      @comment:delete="emit('comment:delete', $event)"
      @comment:edit="emit('comment:edit', $event)"
      @upvote="emit('upvote', $event)"
      @downvote="emit('downvote', $event)"
    />
  </template>
</template>

<style scoped>

</style>
