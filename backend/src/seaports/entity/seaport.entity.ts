import { Field, ObjectType, Float } from '@nestjs/graphql';
@ObjectType()
export class SeaportEntity {
  @Field()
  id!: string;

  @Field()
  portName!: string;

  @Field()
  locode!: string;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field({nullable: true})
  timezoneOlson?: string;

  @Field({nullable: true})
  countryIso?: string;

  @Field({ nullable: true })
  source?: string;
}
