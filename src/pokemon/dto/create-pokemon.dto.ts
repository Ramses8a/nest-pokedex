import { IsPositive, IsString, MinLength, IsInt, Min } from "class-validator";

export class CreatePokemonDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsInt()
    @Min(1)
    @IsPositive()
    no: number;

}
