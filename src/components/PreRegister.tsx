import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PreRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('pre_registrations')
        .insert([
          {
            name: formData.name,
            whatsapp: formData.whatsapp,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Pré-cadastro realizado!",
        description: "Você receberá um e-mail quando o app estiver disponível.",
      });
      
      setFormData({
        name: "",
        whatsapp: "",
      });

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao realizar pré-cadastro",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="section-padding bg-white" id="pre-register">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">📲 Quer ser um dos primeiros?</span>
            </h2>
            <p className="text-lg text-gray-600">
              Deixe suas informações e entre para a lista dos primeiros que vão conhecer e usar o app!
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || isSuccess}
                className={cn(
                  "w-full bg-primary hover:bg-primary-dark text-white transition-all duration-300",
                  isSuccess && "bg-green-500 hover:bg-green-600"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Cadastro realizado!
                  </>
                ) : (
                  "Entrar na lista de espera"
                )}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Não enviaremos spam. Seus dados estão seguros conosco.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreRegister; 