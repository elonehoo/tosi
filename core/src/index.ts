import { TypeCheckError } from './errors'
import type {
  CheckType,
  InferType,
  ObjectType,
  Schema,
  Type,
  UnwrapSchema,
} from './types'

function check<TReturn>(
  type: CheckType,
  input: unknown,
  path?: string[],
): TReturn {
  if (typeof input === type)
    return input as TReturn

  throw new TypeCheckError(type, input, path)
}

export function unknown(): Type<unknown> {
  return {
    check(input: unknown): unknown {
      return input
    },
  }
}

export function string(): Type<string> {
  return {
    check(input: unknown): string {
      return check<string>('string', input)
    },
  }
}

export function number(): Type<number> {
  return {
    check(input: unknown): number {
      return check<number>('number', input)
    },
  }
}

export function boolean(): Type<boolean> {
  return {
    check(input: unknown): boolean {
      return check<boolean>('boolean', input)
    },
  }
}

export function object<TInputSchema extends Schema>(
  schema: TInputSchema,
): ObjectType<UnwrapSchema<TInputSchema>> {
  return {
    schema,
    check(input: unknown): UnwrapSchema<TInputSchema> {
      let lastCheckedKey = '?'

      try {
        const output = check<UnwrapSchema<TInputSchema>>('object', input)

        Object.entries(schema).forEach(([key, val]) => {
          lastCheckedKey = key
          val.check((input as TInputSchema)[key])
        })

        return output
      }
      catch (error) {
        if (error instanceof TypeCheckError) {
          const path = [lastCheckedKey, ...error.path]
          throw new TypeCheckError(error.expected, error.input, path)
        }

        throw error
      }
    },
  }
}

export function optional<TType extends Type<InferType<TType>>>(
  type: TType,
): Type<InferType<TType> | undefined> {
  return {
    ...type,
    check(input: unknown): InferType<TType> | undefined {
      if (input === undefined)
        return undefined

      return type.check(input)
    },
  }
}
