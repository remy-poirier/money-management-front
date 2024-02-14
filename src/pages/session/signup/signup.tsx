import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { CheckCircle2, EyeIcon, EyeOffIcon, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useSignup } from '@/hooks/session/signup.tsx'
import { useUserStore } from '@/store/store.ts'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { signup, isLoading } = useSignup()
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    shouldFocusError: false,
  })

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
    form.setFocus('password')
  }
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
    form.setFocus('confirmPassword')
  }

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    signup({ email: values.email, password: values.password }).then((user) => {
      setUser(user)
      toast.success('Inscription réussie', {
        description: "Redirection vers la page d'accueil",
      })
      navigate('/')
    })
  }

  return (
    <div className="flex flex-col flex-1  items-center justify-center content-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
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

              <FormField
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmation du mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        startIcon={
                          form.getValues('confirmPassword') === '' ||
                          form.formState.errors.confirmPassword ? (
                            <XCircle color="red" size={20} />
                          ) : (
                            <CheckCircle2 color="green" size={20} />
                          )
                        }
                        endIcon={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={toggleShowConfirmPassword}
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
                S'inscrire
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
