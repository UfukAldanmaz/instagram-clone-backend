import { LikedByUserDTO } from './liked-by-user.dto';

export class TimelineResponse {
  id: number;
  url: string;
  user: {
    id: string;
    username: string;
    profilePictureUrl: string;
  };
  likes: LikedByUserDTO[];
  hasLiked: boolean;
}
