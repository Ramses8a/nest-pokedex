import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try{

    const pokemon = await this.pokemonModel.create(createPokemonDto)

    return pokemon;
    } catch (error) {
      this.handleExeptions(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(id: string) {
     
    let pokemon: Pokemon;

    if ( !isNaN(+id) ){
      pokemon = await this.pokemonModel.findOne({ no: id})
    }

    if ( !pokemon && isValidObjectId (id) ){
      pokemon = await this.pokemonModel.findById(id)
    }

    if ( !pokemon){
      pokemon = await this.pokemonModel.findOne({ name: id.toLowerCase().trim()})
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or id "${ id }" not found`)

    return pokemon

  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(id)

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {

      await pokemon.updateOne(updatePokemonDto);

      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error){
      this.handleExeptions(error)
    }

    
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne();

    // return `Pokemon with id ${ id } has been deleted`

    const {deletedCount} = await this.pokemonModel.deleteMany({ _id: id})

    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id ${ id } not found`)

    return ;
  }

  private handleExeptions(error: any){
    if (error.code === 11000){
      throw new BadRequestException(`Pokemon exists in the database ${ JSON.stringify( error.keyValue )}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't createPokemon - Check server logs`)
  }

}
