import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'files' })
export class File {
  @ApiProperty({
    example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
    description: 'File ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'ab123s',
    description: 'Filename',
    uniqueItems: true
  })
  @Column('text')
  filename: string;

  @ApiProperty({
    example: 'pdf',
    description: 'File type',
    uniqueItems: true
  })
  @Column('text')
  type: string;
}
