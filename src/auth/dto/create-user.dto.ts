import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        example: 'test1@test.com',
        description: 'User email',
        uniqueItems: true
    })
    @IsString()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        example: 'Abc12345',
        description: 'User pawsword',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
    
    @ApiProperty({
        example: 'David Lesmes',
        description: 'User full name',
    })
    @IsString()
    @MinLength(1)
    fullName: string;
}
