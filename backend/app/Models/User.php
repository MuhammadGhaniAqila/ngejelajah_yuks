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

#[Fillable([
    'name',
    'email',
    'password',
    'nik',
    'no_wa',
    'role',
    'is_active',
    'login_count',
    'last_login_at',
    'last_login_ip',
    'last_login_channel',
])]
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
            'is_active' => 'boolean',
            'login_count' => 'integer',
            'last_login_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOperator(): bool
    {
        return $this->role === 'operator';
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return (bool) ($this->is_active ?? true) && in_array($this->role, ['admin', 'operator'], true);
    }

    public function reservasiTikets(): HasMany
    {
        return $this->hasMany(ReservasiTiket::class);
    }

    public function antreanVirtuals(): HasMany
    {
        return $this->hasMany(AntreanVirtual::class);
    }

    public function loginLogs(): HasMany
    {
        return $this->hasMany(LoginLog::class);
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
            'is_active' => (bool) ($this->is_active ?? true),
            'last_login_at' => $this->last_login_at?->toIso8601String(),
        ];
    }
}
