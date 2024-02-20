import { IsString, IsNotEmpty } from 'class-validator';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    user: User;

    @IsString()
    @IsNotEmpty()
    post: Post;

    @IsString()
    @IsNotEmpty()
    text: string;
}