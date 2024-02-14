import { z } from 'zod'
import { useState } from 'react'
import { useUserStore } from '@/store/store.ts'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useSignin } from '@/hooks/session/signin.tsx'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const Signin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const { signin, isLoading } = useSignin()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: 'test@test.com',
      password: '12345678',
    },
    shouldFocusError: false,
  })

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
    form.setFocus('password')
  }

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    signin({ email: values.email, password: values.password }).then((user) => {
      setUser(user)
      toast.success('Connexion réussie', {
        description: "Redirection vers la page d'accueil",
      })
      navigate('/')
    })
  }

  return (
    <div className="flex flex-col flex-1  items-center justify-center content-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        endIcon={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleShowPassword}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeIcon size={20} />
                            ) : (
                              <EyeOffIcon size={20} />
                            )}
                          </Button>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" loading={isLoading}>
                Connexion
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
