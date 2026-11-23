<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'nik', 'no_wa', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return in_array($this->role, ['admin', 'operator'], true);
    }

    public function reservasiTikets(): HasMany
    {
        return $this->hasMany(ReservasiTiket::class);
    }

    public function antreanVirtuals(): HasMany
    {
        return $this->hasMany(AntreanVirtual::class);
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'nama_lengkap' => $this->name,
            'email' => $this->email,
            'nik' => $this->nik,
            'no_wa' => $this->no_wa,
            'role' => $this->role,
        ];
    }
}
