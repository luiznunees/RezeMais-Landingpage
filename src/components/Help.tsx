import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Help = () => {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        .from('help_contributors')
        .insert([
          {
            name: formData.name,
            whatsapp: formData.whatsapp,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Formulário enviado!",
        description: "Entraremos em contato em breve. Obrigado pelo interesse!",
      });
      
      setFormData({
        name: "",
        whatsapp: "",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="section-padding bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">💬 Quero ajudar a construir o Reze+!</span>
            </h2>
            <p className="text-lg text-gray-600">
              Você é programador, designer, devoto criativo ou só quer contribuir com ideias? 
              Entre em contato com a gente e vem caminhar junto:
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="help-name">Nome completo</Label>
                  <Input
                    id="help-name"
                    name="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="help-whatsapp">WhatsApp</Label>
                  <Input
                    id="help-whatsapp"
                    name="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white"
              >
                {isSubmitting ? "Enviando..." : "Quero ajudar a construir!"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Help; 