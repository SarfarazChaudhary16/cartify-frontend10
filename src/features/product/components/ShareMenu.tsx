import { Share2, Link2, MessageCircle, Mail } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownPanel, DropdownItem } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/components/ui/Toast'

export function ShareMenu({ title }: { title: string }) {
  const { toast } = useToast()

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
    toast({ type: 'success', title: 'Link copied', description: 'Product link copied to clipboard.' })
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Tooltip content="Share">
          <IconButton icon={<Share2 className="h-5 w-5" />} aria-label="Share this product" variant="outline" />
        </Tooltip>
      </DropdownTrigger>
      <DropdownPanel align="end" className="w-52">
        <DropdownItem onClick={copyLink}>
          <Link2 className="h-4 w-4" /> Copy link
        </DropdownItem>
        <DropdownItem onClick={() => toast({ type: 'info', title: 'Share preview', description: `Would open WhatsApp share for "${title}".` })}>
          <MessageCircle className="h-4 w-4" /> Share on WhatsApp
        </DropdownItem>
        <DropdownItem onClick={() => toast({ type: 'info', title: 'Share preview', description: `Would open email share for "${title}".` })}>
          <Mail className="h-4 w-4" /> Share via Email
        </DropdownItem>
      </DropdownPanel>
    </Dropdown>
  )
}