'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Eye, Copy, Pencil, Trash2, Plus } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  usage: number
  limit?: number
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'default',
      key: 'tvly-********************************',
      createdAt: new Date().toISOString(),
      usage: 24,
    },
  ])
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyLimit, setNewKeyLimit] = useState<number>(1000)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [limitEnabled, setLimitEnabled] = useState(false)
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null)
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return

    if (isEditMode && editingKeyId) {
      // Update existing key
      setApiKeys(apiKeys.map(key => 
        key.id === editingKeyId 
          ? { 
              ...key, 
              name: newKeyName,
              limit: limitEnabled ? newKeyLimit : undefined 
            } 
          : key
      ))
    } else {
      // Create new key
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        name: newKeyName,
        key: `tvly-********************************`,
        createdAt: new Date().toISOString(),
        usage: 0,
        limit: limitEnabled ? newKeyLimit : undefined,
      }
      setApiKeys([...apiKeys, newKey])
    }
    
    // Reset form state
    setNewKeyName('')
    setNewKeyLimit(1000)
    setLimitEnabled(false)
    setIsDialogOpen(false)
    setIsEditMode(false)
    setEditingKeyId(null)
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
  }

  const handleEditKey = (id: string) => {
    const keyToEdit = apiKeys.find(key => key.id === id)
    if (keyToEdit) {
      setNewKeyName(keyToEdit.name)
      setNewKeyLimit(keyToEdit.limit || 1000)
      setLimitEnabled(!!keyToEdit.limit)
      setEditingKeyId(id)
      setIsEditMode(true)
      setIsDialogOpen(true)
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyId(visibleKeyId === id ? null : id);
  }

  // Generate a full API key for display when revealed
  const getDisplayKey = (key: string, isVisible: boolean) => {
    if (isVisible) {
      // This is just for demonstration - in a real app, you'd retrieve the actual key from the backend
      return 'tvly-' + Array(32).fill('0123456789abcdef').map(x => x[Math.floor(Math.random() * x.length)]).join('');
    }
    return key;
  }

  // Copy key to clipboard
  const copyKeyToClipboard = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      // Get the full key (in a real app, you'd retrieve this from your backend)
      const fullKey = 'tvly-' + Array(32).fill('0123456789abcdef').map(x => x[Math.floor(Math.random() * x.length)]).join('');
      
      // Copy to clipboard
      navigator.clipboard.writeText(fullKey)
        .then(() => {
          // Show copied indicator
          setCopiedKeyId(id);
          // Hide copied indicator after 2 seconds
          setTimeout(() => setCopiedKeyId(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Pages / API Playground</div>
          <h1 className="text-3xl font-bold">API Playground</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            <span>Operational</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-amber-500 rounded-xl p-8 mb-10 text-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="bg-white/20 text-white px-3 py-1 rounded-md text-sm mb-4 inline-block">
              CURRENT PLAN
            </div>
            <h2 className="text-4xl font-bold">Researcher</h2>
          </div>
          <Button variant="outline" className="bg-white/20 text-white border-none hover:bg-white/30">
            Manage Plan
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>API Limit</span>
              <span className="text-white/70">ⓘ</span>
            </div>
          </div>
          <Progress value={2.4} className="h-2 bg-white/20" />
          <div className="text-sm">24 / 1,000 Requests</div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">API Keys</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            // Reset form when dialog is closed
            setNewKeyName('')
            setNewKeyLimit(1000)
            setLimitEnabled(false)
            setIsEditMode(false)
            setEditingKeyId(null)
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-center">
                {isEditMode ? 'Edit API key' : 'Create a new API key'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center text-muted-foreground mb-6">
                {isEditMode 
                  ? 'Update the name and limit for this API key.' 
                  : 'Enter a name and limit for the new API key.'}
              </p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Key Name <span className="text-muted-foreground">— A unique name to identify this key</span>
                  </label>
                  <Input
                    placeholder="Key Name"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    className="rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="limitUsage"
                      checked={limitEnabled}
                      onChange={e => setLimitEnabled(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="limitUsage" className="text-sm font-medium">
                      Limit monthly usage*
                    </label>
                  </div>
                  
                  <Input
                    type="number"
                    value={newKeyLimit}
                    onChange={e => setNewKeyLimit(Number(e.target.value))}
                    disabled={!limitEnabled}
                    className={`rounded-md ${!limitEnabled ? 'opacity-50' : ''}`}
                  />
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mt-2">
              <Button 
                onClick={handleCreateKey} 
                className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEditMode ? 'Update' : 'Create'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false)
                  setIsEditMode(false)
                  setEditingKeyId(null)
                  setNewKeyName('')
                  setNewKeyLimit(1000)
                  setLimitEnabled(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-sm text-muted-foreground mb-6">
        The key is used to authenticate your requests to the <span className="text-blue-600 underline">Research API</span>. 
        To learn more, see the <span className="text-blue-600 underline">documentation page</span>.
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-1/4">NAME</TableHead>
            <TableHead className="w-1/6">USAGE</TableHead>
            <TableHead className="w-2/5">KEY</TableHead>
            <TableHead className="w-1/6 text-right">OPTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map(key => {
            const isVisible = visibleKeyId === key.id;
            const isCopied = copiedKeyId === key.id;
            return (
              <TableRow key={key.id} className="border-b">
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>{key.usage}</TableCell>
                <TableCell className="font-mono text-sm">{getDisplayKey(key.key, isVisible)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 ${isVisible ? 'bg-muted' : ''}`}
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 relative ${isCopied ? 'bg-muted' : ''}`}
                      onClick={() => copyKeyToClipboard(key.id)}
                    >
                      {isCopied ? (
                        <>
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            Copied!
                          </span>
                          <Copy size={16} className="text-green-500" />
                        </>
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditKey(key.id)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}