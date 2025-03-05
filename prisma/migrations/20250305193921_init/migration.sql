-- CreateTable
CREATE TABLE "Controlleur" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoData" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'controlleur',
    "tokenResetPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Controlleur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scans" (
    "id" TEXT NOT NULL,
    "controlleurId" TEXT NOT NULL,
    "licence" TEXT NOT NULL,
    "nom" TEXT,
    "prenom" TEXT,
    "photoUrl" TEXT,
    "localPhotoPath" TEXT,
    "rawData" TEXT,
    "htmlStructure" TEXT,
    "photoData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Controlleur_email_key" ON "Controlleur"("email");

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_controlleurId_fkey" FOREIGN KEY ("controlleurId") REFERENCES "Controlleur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
