import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
  /** Ancho del panel */
  size?: 'md' | 'lg' | 'xl'
}

const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = 'lg',
}: ModalProps) => {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="bg-foreground/45 absolute inset-0 animate-[fadeIn_160ms_ease-out] backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'border-border bg-background relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border shadow-2xl outline-none sm:rounded-3xl',
          'animate-[slideUp_200ms_ease-out]',
          sizeClass[size],
          className,
        )}
      >
        <header className="border-border flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
          <div className="min-w-0 space-y-1">
            <h2 id={titleId} className="font-display text-foreground text-xl font-bold sm:text-2xl">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Cerrar"
            onClick={onClose}
            className="shrink-0"
          >
            <IoClose className="size-5" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export type { ModalProps }

export default Modal
