import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { ProductImage } from './product-image.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '23f39990-9b58-4d1b-83f9-1847706ffb4a',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 9.99,
        description: 'Product price',
        default: 0
    })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Aliqua occaecat tempor proident in ex officia excepteur consequat nostrud adipisicing ad aute quis. Esse aliqua amet velit veniam consectetur magna esse eiusmod quis consequat. Proident do aliquip commodo ad occaecat proident tempor.',
        description: 'Product ID'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO'
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 1,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product price'
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['teslo', 'teslo_shop'],
        description: 'Product tags'
    })
    @Column('text', {
        array: true,
        nullable: true,
        default: []
    })
    tags: string[];

    @ApiProperty({
        example: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
        description: 'Product images'
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty({
        example: {
            id: "29b10da4-69aa-4173-bb4b-0226c80b90a2",
            email: "test1@test.com",
            fullName: "Test One",
            isActive: true,
            roles: ["admin"]
        },
        description: 'Product user',
        type: () => User
    })
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_')
            .replaceAll("'", '')
    }
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_')
            .replaceAll("'", '')
    }
}
