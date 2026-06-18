import type { ChangeEvent, KeyboardEvent } from 'react'

type ConfirmationModalProps = {
  open: boolean
  title: string
  description: string
  actionLabel: string
  cancelLabel?: string
  requiredText?: string
  value?: string
  onValueChange?: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  confirmDisabled?: boolean
}

export function ConfirmationModal({
  open,
  title,
  description,
  actionLabel,
  cancelLabel = 'Cancel',
  requiredText,
  value = '',
  onValueChange,
  onConfirm,
  onCancel,
  confirmDisabled,
}: ConfirmationModalProps) {
  if (!open) return null

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange?.(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="w-xl max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/5">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 id="confirmation-modal-title" className="text-lg font-bold text-slate-900">
            {title}
          </h2>
        </div>
        <div className="px-6 py-6 sm:px-8">
          {/* <p className="text-sm leading-7 text-slate-700 ">{description}</p> */}
          <p className="text-sm leading-7 text-slate-700 ">
            This will permanently delete "<span className='text-red-800 font-semibold'>{description}</span>" and all responses. This action cannot be undone.
          </p>

          {requiredText ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                Type <span className="font-semibold text-red-800">{requiredText}</span> to confirm.
              </p>
              <input
                type="text"
                value={value}
                onChange={handleInput}
                className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter repository name"
                autoComplete="off"
              />
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              disabled={confirmDisabled}
              onClick={onConfirm}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
