import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from 'src/csvc/danhmuc/countries/schemas/country.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]), CaslModule],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule { }
