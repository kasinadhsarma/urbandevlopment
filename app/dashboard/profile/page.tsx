"use client"

import { useUser } from "@/app/contexts/UserContext"
import { SkinColor } from "@/app/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const skinColors: Record<SkinColor, string> = {
  light: "bg-[#FFD1B3]",
  medium: "bg-[#D2996C]",
  dark: "bg-[#8D5524]",
}

export default function Profile() {
  const { user, updateProfile, skinColor, setSkinColor } = useUser()
  const [firstName, setFirstName] = useState(user?.name.split(" ")[0] || "")
  const [lastName, setLastName] = useState(user?.name.split(" ")[1] || "")
  const [email, setEmail] = useState(user?.email || "")
  const [jobTitle, setJobTitle] = useState(user?.role || "")
  const [organization, setOrganization] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        name: `${firstName} ${lastName}`,
        email,
        role: jobTitle,
        // Add other fields as necessary
      })
      console.log("Profile updated", { skinColor })
    } catch (error) {
      console.error("Failed to update profile", error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">User Profile</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <Avatar className={`h-24 w-24 ${skinColors[skinColor]}`}>
                <AvatarFallback>UD</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input 
                id="jobTitle" 
                placeholder="Urban Planner" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input 
                id="organization" 
                placeholder="City Planning Department" 
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skinColor">Skin Color</Label>
              <Select value={skinColor} onValueChange={setSkinColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skin color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
