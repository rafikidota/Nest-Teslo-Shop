import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'users' })
export class User {

    @ApiProperty({
        example: '23f39990-9b58-4d1b-83f9-1847706ffb4a',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'test1@test.com',
        description: 'User email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
        example: 'Abc12345',
        description: 'User password'
    })
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty({
        example: 'David Lesmes',
        description: 'User full name'
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: true,
        default: true,
        description: 'Indicate if a user is active or not'
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: ['user', 'admin'],
        default: ['user'],
        description: 'User roles'
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }
    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }


}
