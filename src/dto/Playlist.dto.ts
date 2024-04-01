import { IsOptional, IsInt, MinLength, MaxLength, Min, IsAlpha, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';

import { ServiceType } from 'orm/constants';

export class GetPlaylistRequest {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id: number;

    @IsAlpha()
    @MinLength(2)
    @MaxLength(2)
    countryCode: string;

    @Transform(({ value }) => `${value}`.toLowerCase())
    @IsEnum(ServiceType)
    serviceType: ServiceType;

    @IsOptional()
    @Transform(({ value }) => `${value}`.toLowerCase() === 'true')
    availableOnly?: boolean;
}
