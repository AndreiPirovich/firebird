export type ApiPost = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type PostListItem = ApiPost & {
  previewImageUrl: string;
};

export type PostDetails = ApiPost & {
  imageUrl: string;
};
