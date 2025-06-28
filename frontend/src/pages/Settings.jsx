// import { Card, Input, Switch, Button, Tabs, Tab } from "@heroui/react";
import { useEffect, useState } from "react";
import api from '../utils/api';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        company: {
            name: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            taxNumber: '',
        },
        system: {
            emailNotifications: true,
            darkMode: false,
            language: 'fr',
            timezone: 'UTC+1',
        },
        security: {
            twoFactorAuth: false,
            passwordExpiry: 90,
            sessionTimeout: 30,
        }
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    //   

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/settings/');
            setSettings(response.data);
            setError(null);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Échec du chargement des paramètres';
            setError(errorMessage);
            // toast({
                // title: "Erreur",
                // description: errorMessage,
                // status: "error",
            // });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (section, data) => {
        setSaving(true);
        try {
            await api.patch('/settings/', { [section]: data });
            setSettings(prev => ({
                ...prev,
                [section]: data
            }));
            // toast({
            //     title: "Succès",
            //     description: "Paramètres mis à jour avec succès",
            //     status: "success",
            // });
        } catch (err) {
            // toast({
            //     title: "Erreur",
            //     description: "Échec de la mise à jour des paramètres",
            //     status: "error",
            // });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h1>
            
            <Tabs>
                <Tab key="company" title="Informations sur l'entreprise">
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Nom de l'entreprise"
                                value={settings.company.name}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    company: { ...prev.company, name: e.target.value }
                                }))}
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={settings.company.email}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    company: { ...prev.company, email: e.target.value }
                                }))}
                            />
                            <Input
                                label="Téléphone"
                                value={settings.company.phone}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    company: { ...prev.company, phone: e.target.value }
                                }))}
                            />
                            <Input
                                label="Site Web"
                                value={settings.company.website}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    company: { ...prev.company, website: e.target.value }
                                }))}
                            />
                            <Input
                                label="Numéro de TVA"
                                value={settings.company.taxNumber}
                                onChange={(e) => setSettings(prev => ({
                                    ...prev,
                                    company: { ...prev.company, taxNumber: e.target.value }
                                }))}
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Adresse"
                                    value={settings.company.address}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        company: { ...prev.company, address: e.target.value }
                                    }))}
                                />
                            </div>
                        </div>
                        <Button
                            color="primary"
                            className="mt-4"
                            onClick={() => handleUpdate('company', settings.company)}
                            isLoading={saving}
                        >
                            Enregistrer les informations sur l'entreprise
                        </Button>
                    </Card>
                </Tab>

                <Tab key="system" title="Paramètres du système">
                    <Card className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium">Notifications par e-mail</h3>
                                    <p className="text-sm text-gray-500">Recevoir des notifications par e-mail pour les mises à jour importantes</p>
                                </div>
                                <Switch
                                    checked={settings.system.emailNotifications}
                                    onChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        system: { ...prev.system, emailNotifications: checked }
                                    }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium">Mode sombre</h3>
                                    <p className="text-sm text-gray-500">Utiliser le thème sombre dans toute l'application</p>
                                </div>
                                <Switch
                                    checked={settings.system.darkMode}
                                    onChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        system: { ...prev.system, darkMode: checked }
                                    }))}
                                />
                            </div>
                        </div>
                        <Button
                            color="primary"
                            className="mt-6"
                            onClick={() => handleUpdate('system', settings.system)}
                            isLoading={saving}
                        >
                            Enregistrer les paramètres du système
                        </Button>
                    </Card>
                </Tab>

                <Tab key="security" title="Sécurité">
                    <Card className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium">Authentification à deux facteurs</h3>
                                    <p className="text-sm text-gray-500">Ajouter une couche supplémentaire de sécurité</p>
                                </div>
                                <Switch
                                    checked={settings.security.twoFactorAuth}
                                    onChange={(checked) => setSettings(prev => ({
                                        ...prev,
                                        security: { ...prev.security, twoFactorAuth: checked }
                                    }))}
                                />
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    label="Expiration du mot de passe (jours)"
                                    value={settings.security.passwordExpiry}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        security: { ...prev.security, passwordExpiry: parseInt(e.target.value) }
                                    }))}
                                />
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    label="Délai d'expiration de la session (minutes)"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                                    }))}
                                />
                            </div>
                        </div>
                        <Button
                            color="primary"
                            className="mt-6"
                            onClick={() => handleUpdate('security', settings.security)}
                            isLoading={saving}
                        >
                            Enregistrer les paramètres de sécurité
                        </Button>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
