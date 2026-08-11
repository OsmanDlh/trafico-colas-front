import type { FieldValues, Path } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FormSelectOption = {
  value: string
  label: string
}

type FormSelectProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>
  label?: string
  options: FormSelectOption[]
  className?: string
}

const FormSelect = <TFormValues extends FieldValues>({
  name,
  label,
  options,
  className,
}: FormSelectProps<TFormValues>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>()

  const error = errors[name]

  return (
    <div className={cn('space-y-2', className)}>
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <select
        id={name}
        className={cn(
          'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
        )}
        {...register(name)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-destructive text-xs">{error.message as string}</p> : null}
    </div>
  )
}

export type { FormSelectOption, FormSelectProps }

export default FormSelect
