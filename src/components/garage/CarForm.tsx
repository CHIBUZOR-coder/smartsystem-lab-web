import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import Button from '../ui/Button'
import MultiImageUpload from './MultiImageUpload'

export interface CarFormValues {
  title:          string
  description:    string
  price:          number
  whatsappNumber: string
  images:         string[]
  features:       string[]
}

interface CarFormInternal {
  title:          string
  description:    string
  price:          number
  whatsappNumber: string
  images:         string[]
  features:       { value: string }[]
}

interface CarFormProps {
  defaultValues?: Partial<CarFormValues>
  onSubmit: (values: CarFormValues) => void
  submitting: boolean
  submitLabel: string
  onCancel: () => void
  error?: boolean
}

const toInternal = (v?: Partial<CarFormValues>): Partial<CarFormInternal> => ({
  title:          v?.title ?? '',
  description:    v?.description ?? '',
  price:          v?.price,
  whatsappNumber: v?.whatsappNumber ?? '',
  images:         v?.images ?? [],
  features:       (v?.features?.length ? v.features : ['']).map(value => ({ value })),
})

const CarForm = ({ defaultValues, onSubmit, submitting, submitLabel, onCancel, error }: CarFormProps) => {
  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } =
    useForm<CarFormInternal>({ defaultValues: toInternal(defaultValues) })
  const { fields, append, remove } = useFieldArray({ control, name: 'features' })

  useEffect(() => {
    reset(toInternal(defaultValues))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  const submit = (d: CarFormInternal) => {
    onSubmit({
      ...d,
      price:    Number(d.price),
      features: d.features.map(f => f.value).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand-text-h mb-1">Title</label>
        <input
          className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && <p className="text-brand-danger text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-text-h mb-1">Description</label>
        <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
          {...register('description', { required: 'Description is required' })} />
        {errors.description && <p className="text-brand-danger text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-text-h mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Must be greater than 0' } })}
          />
          {errors.price && <p className="text-brand-danger text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text-h mb-1">WhatsApp number</label>
          <input
            type="tel"
            placeholder="+234..."
            className="w-full px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
            {...register('whatsappNumber', { required: 'WhatsApp number is required' })}
          />
          {errors.whatsappNumber && <p className="text-brand-danger text-xs mt-1">{errors.whatsappNumber.message}</p>}
        </div>
      </div>

      <MultiImageUpload
        folder="cars"
        value={watch('images') ?? []}
        onChange={urls => setValue('images', urls)}
        label="Photos"
      />

      <div>
        <label className="block text-sm font-medium text-brand-text-h mb-1">Features</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                className="flex-1 px-3 py-2 rounded-lg border border-brand-border bg-brand-bg-alt text-brand-text-h text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                placeholder={`Feature ${index + 1}`}
                {...register(`features.${index}.value` as const)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                title="Remove this feature"
                className="text-xs text-brand-danger hover:underline disabled:opacity-40 disabled:pointer-events-none shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append({ value: '' })}
          title="Add another feature"
          className="mt-2 text-xs font-medium text-brand-green hover:underline"
        >
          + Add feature
        </button>
      </div>

      {error && <p className="text-brand-danger text-sm">Save failed. Please try again.</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} title="Close without saving">Cancel</Button>
        <Button type="submit" loading={submitting}>{submitLabel}</Button>
      </div>
    </form>
  )
}

export default CarForm
