export type Func = Parameter<
  'Function',
  {
    name: string;
    parameters: Record<string, ParameterType>;
  }
>;
export type Program = Parameter<
  'Program',
  {
    body: Func[];
  }
>;
export type StringLiteral = Parameter<'StringLiteral', { value: string }>;
export type NumericLiteral = Parameter<'NumericLiteral', { value: number }>;

export type ParameterType =
  | Program
  | Func[]
  | Func
  | StringLiteral
  | NumericLiteral;

type Parameter<T extends Types, D> = {
  type: T;
} & D;

type Types =
  | 'Program'
  | 'StringLiteral'
  | 'NumericLiteral'
  | 'Function'
  | 'Parameter'
  | 'ArrayLiteral';
