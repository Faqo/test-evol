import { IsOptional, IsBoolean, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterTaskDto {
    @IsOptional()
    @IsBoolean()
    completed?: boolean;

    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsDate()
    dateFrom?: Date;

    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : undefined)
    @IsDate()
    dateTo?: Date;
}