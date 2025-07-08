import {z} from 'zod';
import {Form} from '@/components/ui/form'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {AdditionalNoteSchema} from "@/lib/schemas/additional-note";
import {useProductContext} from "@/hooks/use-product-context";
import {ProductQuantity} from "@/components/pages/restaurant-menu-cart/product-quantity";


type ProductAdditionalType = z.infer<typeof AdditionalNoteSchema>;

export function ProductAdditionalInfo() {

    const form = useForm<ProductAdditionalType>({
        resolver: zodResolver(AdditionalNoteSchema),
        mode: 'onSubmit',
        defaultValues: {
            note: ""
        }
    })


    const {total, onSubmit, allRequiredRulesSatisfied, getMissingRequiredRules} = useProductContext()


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="note"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={total === 0}
                                        placeholder="Indique como quer o seu pedido..."
                                        className="text-base"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <div>

                    </div>
                    <ProductQuantity/>
                    <div className='flex justify-center w-full mt-8 flex-col items-center'>
                        <Button type={total === 0 || !allRequiredRulesSatisfied() ? "button" : "submit"}
                                disabled={total === 0 || !allRequiredRulesSatisfied()}
                                className={`self-center mx-auto prevent-select w-full`}>
                            {total === 0 ? "Confirmar" : `Confirmar - ${total}.00 Kz`}
                        </Button>
                        {!allRequiredRulesSatisfied() && (
                            <p className='text-xs text-red-600 mt-2 text-center'>
                                Escolha: {getMissingRequiredRules().join(', ')}
                            </p>
                        )}
                    </div>

                </form>
            </Form>

        </div>
    );
}

