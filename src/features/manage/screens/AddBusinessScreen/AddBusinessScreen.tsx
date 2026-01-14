import { memo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useCategories } from '@/features/business/hooks/useCategories';
import { useCreateBusiness } from '@/features/business/hooks/useCreateBusiness';
import { CreateBusinessData } from '@/features/business/services';
import {
    BasicInfoSection,
    CategorySection,
    ImageSection,
    LocationSection,
    ContactSection,
    SocialLinksSection,
    FormActions,
} from '@/components/manage';
import { styles } from './styles';

export const AddBusinessScreen = memo(function AddBusinessScreen() {
    const colors = useThemedColors();
    const router = useRouter();
    const { data: categories = [], isLoading: loadingCategories } = useCategories();
    const createMutation = useCreateBusiness();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [logoUri, setLogoUri] = useState<string | null>(null);
    const [coverUri, setCoverUri] = useState<string | null>(null);
    const [galleryUris, setGalleryUris] = useState<string[]>([]);
    const [province, setProvince] = useState('');
    const [canton, setCanton] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (selectedCategoryIds.length === 0) newErrors.categories = 'Selecciona al menos una categoría';
        if (!coordinates) newErrors.location = 'Selecciona una ubicación en el mapa';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            const data: CreateBusinessData = {
                name: name.trim(),
                description: description.trim() || undefined,
                categoryIds: selectedCategoryIds,
                province: province || undefined,
                canton: canton || undefined,
                district: district || undefined,
                address: address.trim() || undefined,
                latitude: coordinates!.latitude,
                longitude: coordinates!.longitude,
                phone: phone.trim() || undefined,
                email: email.trim() || undefined,
                website: website.trim() || undefined,
                facebook: facebook.trim() || undefined,
                instagram: instagram.trim() || undefined,
                tiktok: tiktok.trim() || undefined,
                logoUri,
                coverUri,
                galleryUris,
            };

            await createMutation.mutateAsync(data);
            Toast.show({ type: 'success', text1: 'Comercio creado con éxito', position: 'top' });
            router.replace('/manage/businesses');
        } catch (error) {
            console.error('Error creating business:', error);
            Toast.show({ type: 'error', text1: 'Error al crear el comercio', text2: 'Por favor intenta de nuevo', position: 'top' });
        }
    };

    const handleLocationSelect = (location: any) => {
        if (location.province) setProvince(location.province);
        if (location.canton) setCanton(location.canton);
        if (location.district) setDistrict(location.district);
        if (location.address) setAddress(location.address);
        if (location.latitude && location.longitude) {
            setCoordinates({ latitude: location.latitude, longitude: location.longitude });
        }
        if (errors.location) setErrors((e) => ({ ...e, location: '' }));
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background.secondary }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>Agregar Negocio</Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Completa la información para agregar un nuevo negocio
                    </Text>
                </View>

                <BasicInfoSection
                    name={name}
                    description={description}
                    onNameChange={(text) => {
                        setName(text);
                        if (errors.name) setErrors((e) => ({ ...e, name: '' }));
                    }}
                    onDescriptionChange={setDescription}
                    errors={errors}
                />

                <CategorySection
                    categories={categories}
                    selectedIds={selectedCategoryIds}
                    onSelectionChange={(ids) => {
                        setSelectedCategoryIds(ids);
                        if (errors.categories) setErrors((e) => ({ ...e, categories: '' }));
                    }}
                    isLoading={loadingCategories}
                    error={errors.categories}
                />

                <ImageSection
                    logoUri={logoUri}
                    coverUri={coverUri}
                    galleryUris={galleryUris}
                    onLogoChange={setLogoUri}
                    onCoverChange={setCoverUri}
                    onGalleryChange={setGalleryUris}
                />

                <LocationSection
                    onLocationSelect={handleLocationSelect}
                    error={errors.location}
                />

                <ContactSection
                    phone={phone}
                    email={email}
                    website={website}
                    onPhoneChange={setPhone}
                    onEmailChange={setEmail}
                    onWebsiteChange={setWebsite}
                />

                <SocialLinksSection
                    facebook={facebook}
                    instagram={instagram}
                    tiktok={tiktok}
                    onFacebookChange={setFacebook}
                    onInstagramChange={setInstagram}
                    onTiktokChange={setTiktok}
                />

                <FormActions
                    onCancel={() => router.back()}
                    onSubmit={handleSubmit}
                    isSubmitting={createMutation.isPending}
                    submitLabel="Crear Negocio"
                />
            </ScrollView>

            {createMutation.isPending && (
                <View style={styles.loadingOverlay}>
                    <View style={[styles.loadingCard, { backgroundColor: colors.background.primary }]}>
                        <ActivityIndicator size="large" color={colors.primary[500]} />
                        <Text style={[styles.loadingText, { color: colors.text.primary }]}>
                            Creando negocio...
                        </Text>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
});
