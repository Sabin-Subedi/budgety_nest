import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validate,
  validateOrReject,
} from 'class-validator';

class CompositeSubRequest {
  constructor(partial: Partial<CompositeSubRequest>) {
    Object.assign(this, partial);
  }
  @IsString()
  @IsNotEmpty()
  method: string;
  @IsString()
  @IsNotEmpty()
  url: string;
  referenceId: string;
  body: any;

  headers: any;
}

@ValidatorConstraint()
export class IsCompositeSubRequest implements ValidatorConstraintInterface {
  public async validate(
    subRequestArray: CompositeSubRequest[],
    args: ValidationArguments,
  ) {
    const errors = [];
    subRequestArray.forEach((subRequest) => {
      validateOrReject(new CompositeSubRequest(subRequest))
        .then((e) => {
          errors.push(e);
        })
        .catch((e) => {
          errors.push(e);
        });
    });

    return errors.length === 0;
  }
}

export class CompositeRequestDto {
  @IsBoolean()
  allOrNone = false;

  @IsArray()
  @IsNotEmpty()
  @Validate(IsCompositeSubRequest)
  compositeRequest: CompositeSubRequest[];
}
