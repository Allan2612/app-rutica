import { memo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './styles';

export const NoAuthManageScreen = memo(function NoAuthManageScreen() {
    const router = useRouter();

    const handleJoinNow = () => {
        router.push('/(auth)/register');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.mainTitle}>¡Desbloquea tu Potencial!</Text>
                <Text style={styles.subtitle}>
                    Comienza a vender tus productos y servicios hoy mismo
                </Text>
            </View>

            {/* Benefits Section */}
            <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>¿Por qué unirse a Rútica?</Text>

                <BenefitCard
                    icon=""
                    title="Crea tu Negocio"
                    description="Establece tu tienda virtual y llega a miles de clientes potenciales"
                />
                <BenefitCard
                    icon=""
                    title="Aumenta tus Ventas"
                    description="Promociona tus productos y servicios con herramientas profesionales"
                />
                <BenefitCard
                    icon=""
                    title="Gana Reputación"
                    description="Construye tu marca con reseñas y calificaciones de clientes"
                />
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
                <Pressable style={styles.primaryButton} onPress={handleJoinNow}>
                    <Text style={styles.primaryButtonText}>Crear Cuenta Ahora</Text>
                </Pressable>
                <Text style={styles.ctaSubtext}>
                    Es rápido, fácil y completamente gratis
                </Text>
            </View>

            {/* Bottom Info */}
            <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                    ¿Ya tienes cuenta?{' '}
                    <Text
                        style={styles.loginLink}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        Inicia sesión aquí
                    </Text>
                </Text>
            </View>
        </ScrollView>
    );
});

interface BenefitCardProps {
    icon: string;
    title: string;
    description: string;
}

const BenefitCard = memo(function BenefitCard({
    icon,
    title,
    description,
}: BenefitCardProps) {
    return (
        <View style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>{icon}</Text>
            <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{title}</Text>
                <Text style={styles.benefitDescription}>{description}</Text>
            </View>
        </View>
    );
});
