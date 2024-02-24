import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    user: User;

    @IsString()
    homePage?: string;

    @IsString()
    @IsNotEmpty()
    imgUrl: string;

    @IsString()
    @IsNotEmpty()
    text: string;

}