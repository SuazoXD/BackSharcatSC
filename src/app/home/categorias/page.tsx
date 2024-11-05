import GalleryCategories from "./galleriaCategorias";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                </CardHeader>
                <CardContent>
                    <GalleryCategories />
                </CardContent>
            </Card>
        </div>
    );
}
