import { Input } from '../ui/Input'

type BrandingPanelProps = {
  primaryColor: string
  logoUrl: string
  onColorChange: (color: string) => void
  onLogoUrlChange: (url: string) => void
}

export function BrandingPanel({
  primaryColor,
  logoUrl,
  onColorChange,
  onLogoUrlChange,
}: BrandingPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-700">Primary color</p>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded border border-slate-200"
          />
          <Input value={primaryColor} onChange={(e) => onColorChange(e.target.value)} />
        </div>
      </div>

      <Input
        label="Logo URL"
        placeholder="https://example.com/logo.png"
        value={logoUrl}
        onChange={(e) => onLogoUrlChange(e.target.value)}
      />

      <div
        className="rounded-xl border border-slate-200 p-4"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Preview</p>
        <div className="mt-3 flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo preview" className="h-10 w-10 rounded object-contain" />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded text-sm font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              S
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900">Your survey</p>
            <p className="text-sm" style={{ color: primaryColor }}>
              Branded experience
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
