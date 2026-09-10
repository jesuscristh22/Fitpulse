# Regras completas do Firestore (todas as phases, consolidadas)

Cole isso inteiro no Firebase Console > Firestore Database > Regras, substituindo
tudo que já está lá. Isso junta tudo que foi adicionado phase por phase — nada
foi removido, só organizado num lugar só.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isSelf(userId) { return isSignedIn() && request.auth.uid == userId; }
    function isPlatformStaff() {
      return isSignedIn() &&
        (request.auth.token.support == true ||
         request.auth.token.platform_admin == true ||
         request.auth.token.super_admin == true);
    }

    // ---------- Phase 2/3: conta e perfis ----------
    match /users/{userId} {
      allow read: if isSelf(userId) || isPlatformStaff();
      allow create: if isSelf(userId);
      allow update: if isSelf(userId) || isPlatformStaff();
      allow delete: if false;
    }
    match /user_profiles/{userId} { allow read, write: if isSelf(userId) || isPlatformStaff(); }
    match /fitness_profiles/{userId} { allow read, write: if isSelf(userId) || isPlatformStaff(); }

    // ---------- Phase 6/7: exercícios e treinos ----------
    match /exercises/{docId} {
      allow read: if true;
      allow write: if isPlatformStaff();
    }
    match /workouts/{docId} {
      allow read, update, delete: if isSignedIn() && resource.data.ownerId == request.auth.uid || isPlatformStaff();
      allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid;
    }

    // ---------- Phase 8: execução de treino ----------
    match /workout_sessions/{docId} {
      allow read, update, delete: if isSignedIn() && resource.data.userId == request.auth.uid || isPlatformStaff();
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }

    // ---------- Phase 9: questionário Militar ----------
    match /military_intake/{userId} {
      allow read, write: if isSelf(userId) || isPlatformStaff();
    }

    // ---------- Phase 11: programa gerado por IA ----------
    match /military_programs/{userId} {
      allow read: if isSelf(userId) || isPlatformStaff();
      allow write: if false; // só o servidor (Admin SDK) escreve aqui
    }

    // ---------- Phase 12: progresso ----------
    match /weight_logs/{docId} {
      allow read, delete: if isSignedIn() && resource.data.userId == request.auth.uid || isPlatformStaff();
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }
    match /personal_records/{docId} {
      allow read, delete: if isSignedIn() && resource.data.userId == request.auth.uid || isPlatformStaff();
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }

    // ---------- Phase 15: Coach ----------
    match /coach_profiles/{coachId} {
      allow read: if true; // diretório público
      allow write: if isSelf(coachId) || isPlatformStaff();
    }
    match /coach_relationships/{relId} {
      allow read, update: if isSignedIn() &&
        (resource.data.memberId == request.auth.uid || resource.data.coachId == request.auth.uid) || isPlatformStaff();
      allow create: if isSignedIn() && request.resource.data.memberId == request.auth.uid;
    }

    // ---------- Phase 16: Academia/Negócio ----------
    match /gym_profiles/{gymId} {
      allow read: if true; // diretório público
      allow write: if isSignedIn() && (resource == null || resource.data.ownerId == request.auth.uid) || isPlatformStaff();
    }
    match /gym_staff/{relId} {
      allow read, update: if isSignedIn();
      allow create: if isSignedIn() && request.resource.data.staffId == request.auth.uid;
    }
    match /gym_memberships/{relId} {
      allow read, update: if isSignedIn();
      allow create: if isSignedIn() && request.resource.data.memberId == request.auth.uid;
    }

    // ---------- Phase 18: Desafios ----------
    match /challenge_participants/{docId} {
      allow read, update: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    }

    // ---------- Coleções só de servidor (Admin SDK ignora estas regras,
    // então ficam bloqueadas pro cliente de propósito) ----------
    // ai_usage, military_purchases, member_pro_purchases, platform_config,
    // stripe_webhook_events — cobertas pelo "default deny" abaixo.

    // Default deny — sempre por último
    match /{document=**} { allow read, write: if false; }
  }
}
```

## Checklist rápido
Se você já foi colando regras aos poucos, o mais seguro é **apagar tudo** e colar
esse bloco inteiro de uma vez — assim garante que nada ficou faltando ou duplicado.
