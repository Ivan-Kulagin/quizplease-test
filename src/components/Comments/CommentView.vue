<script setup lang="ts">
import { Comment } from '../../types'
type EssentialComment = Pick<Comment, 'author' | 'datetime' | 'text'>
defineProps<EssentialComment>()
</script>

<template>
  <div class="comment-box">
    <div class="comment-box__meta">
      <Avatar :label="author.name[0]" style="background-color: #dee9fc; color: #1a2551" size="normal" shape="circle" />
      <a :href="`#/user/${author.profileId}`">{{ author.name }}</a>
      <span>{{ datetime }}</span>
    </div>
    {{ text }}
  </div>
</template>

<style scoped>
.comment-box {
    padding: 14px;
    background-color: #F9FAFA;
    border-radius: 6px;
    margin: 7px 0;
}
.comment-box__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}
</style>
