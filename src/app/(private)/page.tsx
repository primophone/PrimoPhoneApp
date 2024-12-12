import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

const stats = [
  {
    title: "Total Vendas",
    value: "R$30.000,00",
    icon: DollarSign,
    description: "+20.1% do mês passado",
  },
  {
    title: "Clientes",
    value: "2,350",
    icon: Users,
    description: "+180 novos clientes",
  },
  {
    title: "Compras recentes",
    value: "1,200",
    icon: CreditCard,
    description: "85% Nivél de retenção",
  },
  {
    title: "Usuários novos",
    value: "200",
    icon: Activity,
    description: "nas últimas 24hrs",
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
