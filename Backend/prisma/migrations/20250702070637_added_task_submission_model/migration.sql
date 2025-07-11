-- CreateTable
CREATE TABLE "TaskSubmission" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "developerId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubmission" ADD CONSTRAINT "TaskSubmission_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
